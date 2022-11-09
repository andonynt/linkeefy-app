import React, { useEffect } from 'react';

const FeatureComponent = ({ feature }) => {
  return (
    <div
      id={feature.id}
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
          className={`banner relative w-full lg:w-1/2 ${feature.styles.customImageHeight} flex justify-center`}>
          {feature.image}
        </div>
      </section>
    </div>
  );
};

export default FeatureComponent;
