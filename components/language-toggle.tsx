"use client"; // ระบุให้เป็น Client Component

import { useRouter,usePathname } from 'next/navigation'; // ใช้ useRouter จาก next/navigation
import Cookies from 'js-cookie'; // เพิ่มการนำเข้า js-cookie
//import { useTranslation } from '@/app/i18n/client';
import { languages } from '@/app/i18n/setting'
import { useEffect, useState } from 'react';
import { TbLanguage } from 'react-icons/tb'
import { hasFlag } from 'country-flag-icons'
import * as CountryFlags from 'country-flag-icons/react/3x2'
import {Button,Tooltip, TooltipProvider, TooltipTrigger} from "@/components/ui"
//import { getSession } from '@/lib/session';
export default function LanguageToggle({ initialLocale }: { initialLocale: string }) {
  const router = useRouter();
  const pathname = usePathname()
  
  const [currentLang, setCurrentLang] = useState(initialLocale)

  useEffect(() => {
    const fetchLng = async () =>{

    //const session = await getSession()
    const lang = pathname?.split('/')[1] || languages[0]
    //session.lng = lang
    setCurrentLang(lang)

    }
    fetchLng()
  }, [pathname])
  const languageToCountry: { [key: string]: string } = {
    en: 'US',
    th: 'TH',
    // เพิ่มการแมปภาษาเป็นรหัสประเทศสำหรับภาษาอื่นๆ ตามต้องการ
  }
  //const {t} = useTranslation(currentLang,"common",undefined)
  const toggleLanguage = () => {

    const currentIndex = languages.indexOf(currentLang)
    const nextIndex = (currentIndex + 1) % languages.length
    const nextLang = languages[nextIndex]
    const newPathname = pathname!.replace(/^\/[^\/]+/, `/${nextLang}`)
    Cookies.set('lng', currentLang, { expires: 7 }) // เก็บภาษาใน cookie เป็นเวลา 7 วัน
    router.push(newPathname)
  };
  const countryCode = languageToCountry[currentLang]
  const FlagComponent = countryCode && hasFlag(countryCode) ? CountryFlags[countryCode as keyof typeof CountryFlags] : null


  return (
    <TooltipProvider disableHoverableContent>
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
    <Button 
      onClick={toggleLanguage}
      className="h-5 w-5 sm:h-5 sm:w-5 mt-2 shadow"
      variant="ghost"
      size="icon"
      title={`Current language: ${currentLang.toUpperCase()}. Click to change.`}
    >
      {FlagComponent ? (
        <FlagComponent className="w-4 h-4" />
      ) : (
        <TbLanguage className="w-4 h-4" />
      )}
    </Button>
    </TooltipTrigger>
    </Tooltip>
    </TooltipProvider>
  );
}