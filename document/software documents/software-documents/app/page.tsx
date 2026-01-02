
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Software&nbsp;</span>
        <span className={title({ color: "violet" })}>Documentation&nbsp;</span>
        <div className={subtitle({ class: "mt-4" })}>
          Centralized hub for project specifications and requirements.
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/srs"
        >
          View SRS
        </Link>
      </div>
    </section>
  );
}
