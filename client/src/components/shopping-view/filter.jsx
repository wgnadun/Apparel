import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="p-8 border-b border-gray-50">
        <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-900">Filters</h2>
        <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-1">Refine your selection</p>
      </div>
      <div className="p-8 space-y-10">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-400 mb-6">{keyItem}</h3>
              <div className="grid gap-4 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <label
                    key={option.id || option.label}
                    className="flex font-bold text-sm items-center gap-4 cursor-pointer group text-gray-600 hover:text-black transition-colors"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={(checked) => {
                        handleFilter(keyItem, option.id);
                      }}
                      className="w-5 h-5 rounded-md border-gray-200 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 transition-all shadow-sm"
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
        <div className="pt-4">
             <button 
                onClick={() => {
                    sessionStorage.removeItem("filters");
                    window.location.reload();
                }}
                className="w-full py-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 hover:text-red-500 border border-dashed border-gray-200 rounded-2xl transition-all"
             >
                Clear All Filters
             </button>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;