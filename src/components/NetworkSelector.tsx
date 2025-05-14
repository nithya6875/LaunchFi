import { useState } from "react";
import { useNetwork } from "@/context/NetworkContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NetworkType } from "@/context/NetworkContext";
import { ChevronDown, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

export const NetworkSelector = () => {
  const { network, setNetwork, customRpcUrl, setCustomRpcUrl } = useNetwork();
  const [newCustomUrl, setNewCustomUrl] = useState(customRpcUrl);

  // Define network display names
  const networkNames: Record<Exclude<NetworkType, 'custom'>, string> = {
    mainnet: "Mainnet",
    devnet: "Devnet",
    testnet: "Testnet",
    localhost: "Localhost"
  };

  // Network badge color classes
  const networkColorClasses: Record<NetworkType, string> = {
    mainnet: "bg-green-500",
    devnet: "bg-blue-500",
    testnet: "bg-yellow-500",
    localhost: "bg-purple-500",
    custom: "bg-orange-500"
  };

  // Get current network display name
  const getCurrentNetworkName = () => {
    if (network === 'custom') {
      return "Custom RPC";
    }
    return networkNames[network];
  };

  // Handle save custom RPC
  const handleSaveCustomRpc = () => {
    setCustomRpcUrl(newCustomUrl);
    // The context will automatically set network to 'custom'
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 pr-3">
            <div className={`w-2 h-2 rounded-full ${networkColorClasses[network]}`} />
            <span>{getCurrentNetworkName()}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {Object.entries(networkNames).map(([key, name]) => (
            <DropdownMenuItem
              key={key}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setNetwork(key as NetworkType)}
            >
              <div className={`w-2 h-2 rounded-full ${networkColorClasses[key as NetworkType]}`} />
              <span>{name}</span>
              {network === key && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          ))}

          {/* If we have a custom RPC URL, show it */}
          {customRpcUrl && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setNetwork('custom')}
              >
                <div className={`w-2 h-2 rounded-full ${networkColorClasses.custom}`} />
                <span className="max-w-[180px] truncate text-xs" title={customRpcUrl}>Custom: {customRpcUrl}</span>
                {network === 'custom' && (
                  <span className="ml-auto text-xs text-muted-foreground">✓</span>
                )}
              </DropdownMenuItem>
            </>
          )}

          {/* Add Custom RPC Dialog Trigger */}
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Custom RPC</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Custom RPC URL</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="custom-rpc" className="text-sm font-medium mb-2 block">
                  Enter RPC URL
                </Label>
                <Input
                  id="custom-rpc"
                  placeholder="https://your-custom-rpc.com"
                  value={newCustomUrl}
                  onChange={(e) => setNewCustomUrl(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  For better performance, consider using an RPC provider like Helius, QuickNode, or Alchemy.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="mr-2">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleSaveCustomRpc} disabled={!newCustomUrl}>
                    Save & Connect
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
