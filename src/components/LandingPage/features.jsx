import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import banner from '../../assets/images/banner.svg';
import { Card } from '../componentsDispatcher';
import phone from '../../assets/images/phone.png';

export default [
  {
    title: 'create a mobile-friendly portfolio in a few clicks',
    id: 'home',
    styles: {
      background: 'bg-[#231651]',
      fontColor: 'text-[#D6FFF6]',
      mobileDirection: 'flex-col-reverse',
      desktopDirection: 'lg:flex-row',
      fontSize: 'lg:text-6xl md:text-4xl text-2xl',
    },
    text: 'Connect all your links and social media profiles at one page. Create your own micro-landing page.',
    reverseFlexInMobile: true,
    image: (
      <img src={banner} className='w-full mx-auto max-w-lg' alt='banner' />
    ),
    button: (
      <Link to='/signup' className='self-center lg:self-start mt-4'>
        <Button background='#000' rounded='full'>
          sign up for free
        </Button>
      </Link>
    ),
  },
  {
    title: 'your micro-landing page',
    id: 'discover',
    styles: {
      background: 'bg-[#4024A1]',
      fontColor: 'text-white',
      mobileDirection: 'flex-col-reverse',
      desktopDirection: 'lg:flex-row-reverse',
      fontSize: 'lg:text-5xl md:text-3xl text-xl',
      customImageHeight: 'h-[541px]',
    },
    background: 'bg-paleGreen/95',
    text: 'You have endless possibilities to share your ideas, your business or yourself without any effort or technical skills.',
    image: <Card />,
  },
  {
    title: 'multiple links at one place',
    id: 'how',
    styles: {
      background: 'bg-softLilac/90',
      fontColor: 'text-[#231651]',
      mobileDirection: 'flex-col-reverse',
      desktopDirection: 'lg:flex-row',
      fontSize: 'lg:text-5xl md:text-3xl text-xl',
      customImageHeight: 'h-[600px]',
    },
    background: 'bg-paleGreen/95',
    text: 'Connect your socials, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert.',
    image: (
      <div
        src={phone}
        className='socials card show w-[300px] duration-1000 h-[600px]'
        alt='phone'></div>
    ),
    button: (
      <Link to='/signup' className='self-center lg:self-start mt-4'>
        <Button background='#000' rounded='full'>
          sign up for free
        </Button>
      </Link>
    ),
  },
];
