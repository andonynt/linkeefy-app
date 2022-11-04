import React, { useEffect } from 'react';

const FeatureComponent = ({ feature }) => {
  let current = 1,
    previous = 0;

  useEffect(() => {
    if (feature.loop) {
      const interval = setInterval(() => {
        const $cards = document.querySelectorAll('.card');

        $cards[current].classList.add('show');
        $cards[current].classList.remove('hide');

        $cards[previous].classList.remove('show');
        $cards[previous].classList.add('hide');

        current += 1;
        previous = current - 1;

        if (current === 3) current = 0;

        if (current === 1) previous = 0;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div
      className={`${feature.styles.background} fade pt-[137px] min-h-screen flex w-full`}>
      <section
        className={`flex-grow center flex ${feature.styles.mobileDirection} justify-center ${feature.styles.desktopDirection} items-center lg:mt-0 py-14`}>
        {/* Banner */}
        <div
          className={`${feature.styles.fontColor} w-full lg:w-1/2 flex flex-col mt-10 lg:mt-0 lg:space-y-5`}>
          <h1 className={`${feature.styles.fontSize} capitalize font-bold`}>
            {feature.title}
          </h1>
          <h3 className='text-sm font-medium lg:text-lg mt-2'>
            {feature.text}
          </h3>
          {feature?.button}
        </div>

        {/* Image */}
        <div
          className={`banner relative w-full ${feature.styles.customImageHeight} lg:w-1/2 flex justify-center`}>
          {feature.image}
        </div>
      </section>
    </div>
  );
};

export default FeatureComponent;
