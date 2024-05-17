"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Languages } from "@/lib/shared-types";
import { Dispatch, SetStateAction } from "react";

export function LanguageSelect({
  languages,
  selectedLanguage,
  setSelectedLanguage,
  placeholder,
}: {
  languages: Languages[];
  selectedLanguage: Languages | null;
  setSelectedLanguage: Dispatch<SetStateAction<Languages | null>>;
  placeholder: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[180px] justify-start truncate"
          >
            {selectedLanguage ? (
              <>{selectedLanguage?.language}</>
            ) : (
              <>{placeholder}</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList
            setOpen={setOpen}
            languages={languages}
            setSelectedLanguage={setSelectedLanguage}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-start truncate">
          {selectedLanguage ? (
            <>{selectedLanguage.language}</>
          ) : (
            <>{placeholder}</>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            setOpen={setOpen}
            languages={languages}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  languages,
  setSelectedLanguage,
}: {
  setOpen: (open: boolean) => void;
  languages: Languages[];
  setSelectedLanguage: Dispatch<SetStateAction<Languages | null>>;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter language..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {languages.map((language) => (
            <CommandItem
              key={language.id}
              value={language.language}
              onSelect={(value) => {
                setSelectedLanguage(
                  languages.find((lang) => lang.language === value) || null,
                );
                setOpen(false);
              }}
            >
              {language.language}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
