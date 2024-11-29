import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getCompanies } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  let companies = await getCompanies();
  companies = companies.sort(
    (a, b) =>
      b.runs.reduce((sum, run) => sum + run.mileage, 0) -
      a.runs.reduce((sum, run) => sum + run.mileage, 0)
  );

  return (
    <main className="w-screen flex flex-col px-8 py-12 gap-4">
      <Card className="!bg-transparent">
        <CardHeader>
          <CardTitle>Company Ranking</CardTitle>
          <CardDescription>
            See a rolling, live ranking for the most mileage clocked per company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="w-full h-full">
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Runs Clocked</TableHead>
                <TableHead className="text-right">Mileage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company, index) => {
                return (
                  <TableRow key={company.name}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.runs.length}</TableCell>
                    <TableCell className="text-right">
                      {company.runs.reduce((sum, run) => sum + run.mileage, 0)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="!bg-transparent">
        <CardHeader>
          <CardTitle>Submit a new run</CardTitle>
          <CardDescription>
            Log a new run to advance your company in the rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={"/submit"}>Submit</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
