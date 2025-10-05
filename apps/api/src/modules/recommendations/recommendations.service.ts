import { prisma } from '@carbon-ledger/db';
import { logger } from '../../utils/logger';

interface CategoryStats {
  category: string;
  totalKg: number;
  percentage: number;
  count: number;
}

export class RecommendationsService {
  /**
   * Generate recommendations based on user's emission patterns
   */
  async generateRecommendations(userId: string, month?: string) {
    const now = new Date();
    const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get user's accounts
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = accounts.map((a) => a.id);

    // Parse month
    const [year, monthNum] = targetMonth.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);

    // Get transactions for the month
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
        date: { gte: startDate, lte: endDate },
      },
      include: { emissionEstimate: true },
    });

    // Calculate category statistics
    const categoryStats = this.calculateCategoryStats(transactions);
    const totalEmissions = categoryStats.reduce((sum, cat) => sum + cat.totalKg, 0);

    logger.info(`Generating recommendations for user ${userId}, month ${targetMonth}`);
    logger.info(`Total emissions: ${totalEmissions.toFixed(2)} kg CO2e`);

    const recommendations = [];

    // Transport.fuel recommendations
    const fuelStats = categoryStats.find((c) => c.category === 'transport.fuel');
    if (fuelStats && fuelStats.percentage > 5) {
      recommendations.push({
        title: 'Reduce Driving Emissions',
        description: `Fuel purchases account for ${fuelStats.percentage.toFixed(1)}% of your carbon footprint. Try carpooling or public transit 2 days per week to reduce emissions by ~20%.`,
        estReductionKg: fuelStats.totalKg * 0.20,
        category: 'transport.fuel',
      });
    }

    // Public transit alternative
    if (fuelStats && fuelStats.totalKg > 5) {
      recommendations.push({
        title: 'Switch to Public Transportation',
        description: 'Replace one weekly car trip with public transit. Public transit emits 45% less CO2 per passenger mile than driving alone.',
        estReductionKg: fuelStats.totalKg * 0.15,
        category: 'transport.publictransit',
      });
    }

    // Electricity recommendations
    const electricityStats = categoryStats.find((c) => c.category === 'utilities.electricity');
    if (electricityStats && electricityStats.totalKg > 10) {
      recommendations.push({
        title: 'Optimize Home Energy Use',
        description: 'Your electricity usage is above average. Switch to LED bulbs, adjust thermostat by 2°F, and use power strips to eliminate phantom loads. Potential reduction: 15-20%.',
        estReductionKg: electricityStats.totalKg * 0.175,
        category: 'utilities.electricity',
      });
    }

    // Airline travel recommendations
    const airlineStats = categoryStats.find((c) => c.category === 'transport.airline');
    if (airlineStats && airlineStats.totalKg > 100) {
      recommendations.push({
        title: 'Consider Alternatives to Air Travel',
        description: 'Air travel is carbon-intensive. For trips under 500 miles, consider train or car alternatives. For necessary flights, purchase carbon offsets.',
        estReductionKg: airlineStats.totalKg * 0.10,
        category: 'transport.airline',
      });
    }

    // Apparel recommendations
    const apparelStats = categoryStats.find((c) => c.category === 'apparel');
    if (apparelStats && apparelStats.totalKg > 30) {
      recommendations.push({
        title: 'Choose Sustainable Fashion',
        description: 'Fast fashion has a significant carbon footprint. Buy fewer, higher-quality items, shop secondhand, or rent special occasion clothing.',
        estReductionKg: apparelStats.totalKg * 0.25,
        category: 'apparel',
      });
    }

    // Food recommendations
    const restaurantStats = categoryStats.find((c) => c.category === 'restaurants');
    const groceryStats = categoryStats.find((c) => c.category === 'grocery');
    const foodEmissions = (restaurantStats?.totalKg || 0) + (groceryStats?.totalKg || 0);
    
    if (foodEmissions > 5) {
      recommendations.push({
        title: 'Reduce Food Carbon Footprint',
        description: 'Food accounts for a significant portion of your emissions. Try one meatless day per week, reduce food waste, and buy local produce.',
        estReductionKg: foodEmissions * 0.15,
        category: 'food',
      });
    }

    // General efficiency recommendation
    if (totalEmissions > 10) {
      recommendations.push({
        title: 'Set a Monthly Carbon Budget',
        description: `Your monthly emissions are ${totalEmissions.toFixed(0)} kg CO2e. Set a goal to reduce by 10% next month through small changes across all categories.`,
        estReductionKg: totalEmissions * 0.10,
        category: 'general',
      });
    }

    // Save recommendations to database
    const saved = [];
    for (const rec of recommendations) {
      const existing = await prisma.recommendation.findFirst({
        where: {
          userId,
          month: targetMonth,
          title: rec.title,
        },
      });

      if (!existing) {
        const created = await prisma.recommendation.create({
          data: {
            userId,
            month: targetMonth,
            title: rec.title,
            description: rec.description,
            estReductionKg: rec.estReductionKg,
          },
        });
        saved.push(created);
      } else {
        saved.push(existing);
      }
    }

    logger.info(`Generated ${saved.length} recommendations for user ${userId}`);

    return saved;
  }

  private calculateCategoryStats(transactions: any[]): CategoryStats[] {
    const categoryMap = new Map<string, { totalKg: number; count: number }>();
    let grandTotal = 0;

    transactions.forEach((txn) => {
      const kg = txn.emissionEstimate?.kgCO2e || 0;
      grandTotal += kg;
      
      const existing = categoryMap.get(txn.category) || { totalKg: 0, count: 0 };
      categoryMap.set(txn.category, {
        totalKg: existing.totalKg + kg,
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      totalKg: data.totalKg,
      percentage: grandTotal > 0 ? (data.totalKg / grandTotal) * 100 : 0,
      count: data.count,
    }));
  }

  async acceptRecommendation(recommendationId: string) {
    return prisma.recommendation.update({
      where: { id: recommendationId },
      data: { accepted: true },
    });
  }

  async getRecommendations(userId: string, month?: string) {
    const where: any = { userId };
    if (month) {
      where.month = month;
    }

    return prisma.recommendation.findMany({
      where,
      orderBy: { estReductionKg: 'desc' },
    });
  }
}

