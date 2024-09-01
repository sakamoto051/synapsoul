// src/app/settings/page.tsx
"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">設定</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-4">
            <Link href="/settings/profile" passHref>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2" />
                プロフィール設定
              </Button>
            </Link>
            {/* <Link href="/settings/notifications" passHref>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="mr-2" />
                通知設定
              </Button>
            </Link> */}
            {/* <Link href="/settings/security" passHref>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2" />
                セキュリティ設定
              </Button>
            </Link> */}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
