import { format, intlFormat } from "date-fns";

export default function DateComponent({ dateString, locale = 'de' }: { dateString: string, locale?:string }) {
  return (
    <time dateTime={dateString}>
      {/* {format(new Date(dateString), "LLLL	d, yyyy", {
        locale: 'de-DE',
      })} */}

      {intlFormat(new Date(dateString), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }, {
        locale: `${locale}-${locale.toUpperCase()}`,
      })}
    </time>
  );
}
