import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function SearchBox({}: {}) {
  const [queryParam, setQueryParam] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    // Handle search logic here
    router.push(`?q=${queryParam}`);
  };

  return (
    <div className="flex gap-5">
      <Input
        placeholder="Search..."
        className="px-5"
        value={queryParam}
        onChange={(e) => setQueryParam(e.target.value)}
      />
      <Button onClick={handleSearch} className="px-5">
        Search
      </Button>
    </div>
  );
}
