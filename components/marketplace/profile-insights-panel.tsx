"use client";

import { BarChart3 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileInsightPoint } from "@/types/marketplace";

type ProfileInsightsPanelProps = {
  data: ProfileInsightPoint[];
};

export function ProfileInsightsPanel({ data }: ProfileInsightsPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        onClick={() => setOpen((value) => !value)}
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Profile insights
      </Button>

      {open ? (
        <Card className="rounded-[28px]">
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
                <p className="mt-2 text-2xl font-semibold">
                  {data.reduce((sum, item) => sum + item.visits, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listing impressions</p>
                <p className="mt-2 text-2xl font-semibold">
                  {data.reduce((sum, item) => sum + item.impressions, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chats started</p>
                <p className="mt-2 text-2xl font-semibold">
                  {data.reduce((sum, item) => sum + item.chats, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visitor growth</p>
                <p className="mt-2 text-2xl font-semibold">
                  +{data[data.length - 1]?.growth ?? 0}
                </p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="visitsGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1A56DB" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#1A56DB"
                    fill="url(#visitsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
