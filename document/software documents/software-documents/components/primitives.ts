
import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

export const srsPrimitives = {
  // Fonts
  font: 'font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]',

  // Headings
  h1: 'text-[crimson] text-[2.5em] my-[1em] font-bold font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]',
  h2: 'text-[#C00000] font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] text-2xl font-bold mt-[1.4em]',
  h3: 'text-[#365F91] font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] text-xl font-bold mt-[1.4em]',
  h4: 'text-blue-700 italic font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] font-bold mt-[1.4em]',
  h5: 'text-black font-bold mt-[1.2em] font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]',

  // Text
  text: 'text-[#1a1a1a] leading-normal font-sans text-base',
  textLink: 'text-[#1a1a1a] hover:underline cursor-pointer',

  // Tables
  table: 'w-full border-collapse border border-[#1a1a1a] my-4 text-sm',
  th: 'border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold',
  td: 'border border-[#1a1a1a] p-2',

  // Layout
  pageBreak: 'break-before-page',
  printHidden: 'print:hidden',

  // Specialized
  coverTitle: 'text-[crimson] text-[2.5em] my-[1em] font-bold',
  tocTitle: 'text-[#C00000] font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] text-2xl font-bold mb-8 text-center uppercase border-b-2 border-[#C00000] pb-2',
};
