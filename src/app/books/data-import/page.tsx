// pages/data-import.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataImportForm from '../../_components/books/DataImportForm';

export default function DataImportPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">読書データインポート</h1>
      <Card>
        <CardHeader>
          <CardTitle>読書メーターからデータをインポート</CardTitle>
          <CardDescription>
            読書メーターのユーザーIDを入力してインポートを開始してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataImportForm />
        </CardContent>
      </Card>
    </div>
  );
}