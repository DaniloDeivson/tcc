import React from 'react'

interface TitleDashboardProps {
  title: string;
  subtitle: string;
}

const TitleDashboard: React.FC<TitleDashboardProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col justify-start gap-2 w-full max-w-[960px] px-4 sm:px-0 mt-6 sm:mt-10">
        <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
        <p className="text-xs sm:text-sm text-[#9EBF9E]">{subtitle}</p>
    </div>
  )
}

export default TitleDashboard
