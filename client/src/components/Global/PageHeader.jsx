import React from 'react'

export default function PageHeader(props) {
    const { title, subtitle } = props;
  return (
      <div>
          <h1 className="text-2xl font-bold text-black col-span-2">
              {
                  title
              }
          </h1>
          
          <p className="text-gray-700 text-sm col-span-12">
              {subtitle}
          </p>
      </div>
  )
}
