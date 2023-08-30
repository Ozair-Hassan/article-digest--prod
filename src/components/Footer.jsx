import React from 'react'
import { logoC } from '../assets'
import { socialMedia, footerLinks } from '../constants'
const Footer = () => (
  <section
    className={`flex justify-center items-center  mt-24 sm:py-10 py-6 flex-col w-full`}
  >
    <div
      className={`flex justify-center items-start md:flex-row flex-col mb-4 w-full`}
    >
      <div className="flex-1 flex flex-col justify-start mmr-10">
        <img
          src={logoC}
          alt="ReadWise AI"
          className="w-[266px] h-[135px] object-contain"
        />
        <p
          className={`font-satoshi font-normal text-gray-300 text-[18px] leading-[30.8px] mt-8  max-w-[410px] `}
        >
          Experience a New Way of Effortless, Accessible, and Universally
          Enjoyable Reading.
        </p>
      </div>
      <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-8">
        {footerLinks.map((footerlink) => (
          <div
            key={footerlink.title}
            className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}
          >
            <h4 className="font-satoshi font-medium text-[18px] leading-[27px] ">
              <span className="blue_gradient">{footerlink.title}</span>
            </h4>
            <ul className="list-none mt-4">
              {footerlink.links.map((link, index) => (
                <li
                  key={link.name}
                  className={` font-normal text-[16px] leading-[24px] text-white hover:text-cyan-400  cursor-pointer ${
                    index !== footerlink.links.length - 1 ? 'mb-4' : 'mb-0'
                  }`}
                  onClick={() => window.open(link.link)}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
        Copyright Ⓒ 2023 ReadWise AI. All Rights Reserved.{' '}
        <br className="sm:block hidden" />
        <span className="text-[14px] text-left block">
          Coded By Ozair Hassan
        </span>
      </p>

      <div className="flex flex-row md:mt-0 mt-6">
        {socialMedia.map((social, index) => (
          <img
            key={social.id}
            src={social.icon}
            alt={social.id}
            className={`w-[21px] h-[21px] object-contain cursor-pointer ${
              index !== socialMedia.length - 1 ? 'mr-6' : 'mr-0'
            }`}
            onClick={() => window.open(social.link)}
          />
        ))}
      </div>
    </div>
  </section>
)

export default Footer
