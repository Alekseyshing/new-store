import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import DashBoardCard from "@/components/DashBoardCard/DashBoardCard";

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  })

  return {
    amount: (Number(data._sum.pricePaidInCents?.toString()) || 0) / 100,
    numberOfSales: data._count,
  }
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ])

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (Number(orderData._sum.pricePaidInCents?.toString()) || 0) / userCount / 100,
  }
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ])

  return { activeCount, inactiveCount }
}


export default async function AdminDashboard(){
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ])
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <DashBoardCard 
      title="Sales" 
      subtitle={`${formatNumber(salesData.numberOfSales)} Orders`} 
      body={formatCurrency(salesData.amount)}
    />
    <DashBoardCard 
      title="Customers" 
      subtitle={`${formatCurrency(userData.averageValuePerUser)} Average value`} 
      body={formatNumber(userData.userCount)}
    />
    <DashBoardCard 
      title="Active Products" 
      subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
      body={formatNumber(productData.activeCount)}
    />
  </div>
}


