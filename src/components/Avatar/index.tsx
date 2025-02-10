import { Media } from '@/components/Media'
import { Media as MediaType} from '@/payload-types';

interface Props {
  name: string;
  picture: MediaType;
}

export default function Avatar({ name, picture }: Props) {
  return (
    <div className="flex items-center text-xl">
      <div className="mr-4 h-12 w-12">
        {picture &&
          <Media priority imgClassName="h-full rounded-full object-cover" resource={picture} />
        }
      </div>
      <div className="text-pretty text-xl font-bold">{name}</div>
    </div>
  );
}
