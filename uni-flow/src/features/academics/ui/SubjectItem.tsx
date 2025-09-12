import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { SubjectEntity } from '@/entities';

interface Props {
  className?: string;
  subject: SubjectEntity;
}

export const SubjectItem = (props: Props) => {
  const { subject } = props;

  return (
    <Link href={`/academic/term/${subject.termId}/subject/${subject.id}`} key={subject.id} className={clsx("border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-[calc(100%-16px)]")}>
      <div className="flex items-center space-x-4 w-full">
        <div className="bg-gray-100 p-3 rounded-full">
          <Image
            src="/academic.svg"
            alt="Subject"
            width={48}
            height={48}
            className="filter brightness-0"
          />
        </div>
        <div className="flex justify-between items-start space-x-4 w-full">
          <div>
            <h3 className="font-semibold text-lg">{subject.title}</h3>
            <p className="text-gray-600">{subject.code}</p>
            <p className="text-gray-600">Credit: {subject.credits}</p>
            <p className="text-gray-600">{subject.actualGrade || 0}/{subject.goalGrade || 0}</p>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              alert(subject.id);
            }}
            className="z-10 p-2 -m-2 hover:bg-gray-100 rounded-full"
          >
            <Image
              src="/more.svg"
              alt="More"
              width={24}
              height={24}
              className="filter brightness-0"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
