"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import OrderHistory from "@/components/profile/OrderHistory";
import Promotions from "@/components/profile/Promotions";
import { Settings } from "@/components/profile/Settings";

export default function ProfilePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>
      
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="orders">История заказов</TabsTrigger>
          <TabsTrigger value="promotions">Акции</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>
        
        <TabsContent value="promotions">
          <Promotions />
        </TabsContent>
        
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
} 