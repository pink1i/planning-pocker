
import classNames from "classnames"
import * as React from "react"

export default React.forwardRef(({ label, error, helperText = "", className, ...props }, ref) => {
  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative rounded-md mt-1">

        <input
          ref={ref}
          className={classNames(
            "outline-none block w-full pl-3 pr-3 sm:text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2",
            error && "focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && helperText && <span className="text-red-500 text-sm">{helperText}</span>}
      </div>
    </div>
  )
})
