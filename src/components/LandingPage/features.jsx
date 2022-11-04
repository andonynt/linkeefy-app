import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import banner from '../../assets/images/banner.svg';
import { Card } from '../componentsDispatcher';
import image1 from '../../assets/images/feature-spotify.png';
import image2 from '../../assets/images/feature-twitter.png';
import image3 from '../../assets/images/feature-youtube.png';

export default [
  {
    title: 'create a mobile-friendly portfolio in a few clicks',
    styles: {
      background: 'bg-softLilac',
      fontColor: 'text-customPurple',
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
    styles: {
      background: 'bg-digiDenim/80',
      fontColor: 'text-white',
      mobileDirection: 'flex-col-reverse',
      desktopDirection: 'lg:flex-row-reverse',
      fontSize: 'lg:text-4xl md:text-3xl text-xl',
      customImageHeight: 'h-[541px]',
    },
    background: 'bg-paleGreen/95',
    text: 'You have endless possibilities to share your ideas, your business or yourself without any effort or technical skills.',
    image: <Card />,
  },
  {
    title: 'multiple links at one place',
    styles: {
      background: 'bg-softLilac/90',
      fontColor: 'text-black',
      mobileDirection: 'flex-col-reverse',
      desktopDirection: 'lg:flex-row',
      fontSize: 'lg:text-4xl md:text-3xl text-xl',
      customImageHeight: 'h-[541px]',
    },
    background: 'bg-paleGreen/95',
    text: 'Connect your socials, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert.',
    image: (
      <>
        <img
          src={image1}
          className='card show w-[260px] duration-1000 h-[541px]'
          alt='feature'
        />
        <img
          src={image2}
          className='card hide w-[260px] duration-1000 h-[541px]'
          alt='feature'
        />
        <img
          src={image3}
          className='card hide w-[260px] duration-1000 h-[541px]'
          alt='feature'
        />
      </>
    ),
    loop: true,
    button: (
      <Link to='/signup' className='self-center lg:self-start mt-4'>
        <Button background='#000' rounded='full'>
          sign up for free
        </Button>
      </Link>
    ),
  },
];
