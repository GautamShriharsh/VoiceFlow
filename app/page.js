import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2> Hello there how are you</h2>
      <Button >Button</Button>

      <UserButton/>
    </div>
  );
}
