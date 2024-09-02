import type React from "react";
import { ChevronDown, HelpCircle, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type StatusConfig<T extends string> = Record<
  T,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
  }
>;

interface StatusDropdownProps<T extends string> {
  currentStatus: T | null;
  onStatusChange: (status: T | null) => void;
  statusConfig: StatusConfig<T>;
  allowNull?: boolean;
  nullLabel?: string;
}

export function StatusDropdown<T extends string>({
  currentStatus,
  onStatusChange,
  statusConfig,
  allowNull = true,
  nullLabel = "ステータスを未設定に",
}: StatusDropdownProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${
            currentStatus && statusConfig[currentStatus]
              ? statusConfig[currentStatus].color
              : "bg-gray-600"
          } text-white flex items-center justify-between w-full`}
        >
          {currentStatus && statusConfig[currentStatus] ? (
            <>
              <span>{statusConfig[currentStatus].icon}</span>
              <span>{statusConfig[currentStatus].label}</span>
            </>
          ) : (
            <>
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>ステータス未設定</span>
            </>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]">
        {(Object.keys(statusConfig) as T[]).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onStatusChange(status)}
            className={`${statusConfig[status].color} text-white hover:${statusConfig[status].color}/80 flex items-center`}
          >
            <span className="mr-2">{statusConfig[status].icon}</span>
            <span>{statusConfig[status].label}</span>
          </DropdownMenuItem>
        ))}
        {allowNull && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onStatusChange(null)}
              className="bg-gray-600 text-white hover:bg-gray-700 flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              <span>{nullLabel}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
