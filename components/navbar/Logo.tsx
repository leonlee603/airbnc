import { VscVerifiedFilled } from "react-icons/vsc";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Logo() {
  return (
    <Button size='icon' asChild>
      <Link href='/'>
        <VscVerifiedFilled className='w-6 h-6' />
      </Link>
    </Button>
  )
}