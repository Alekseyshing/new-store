import { Card, CardDescription, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

type DashboardCardProps = {
  title: string, 
  subtitle: string, 
  body: string
}

export default function DashBoardCard({title, subtitle, body}: DashboardCardProps){
   return <Card>
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
      </CardHeader>
      <div className="p-6">
        <CardDescription>{subtitle}</CardDescription>
      </div>
      <CardContent>
          <p>{body}</p>
      </CardContent>
    </Card>
}