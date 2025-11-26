import { AlertTriangle } from "lucide-react"

const PriceWarning = ({ price, maximumPrice, minimumPrice }: { price: number, maximumPrice: number, minimumPrice: number }) => {
    if (Number(price) > Number(maximumPrice)) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-red-800">
                            Price Greater Than Maximum
                        </h4>
                        <p className="text-sm text-red-700 mt-1">
                            Your selling price is Greater than the maximum allowable blank price.
                        </p>
                    </div>
                </div>
            </div>
        )
    } else if (Number(price) < Number(minimumPrice)) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-red-800">
                            Price Less Than Minimum
                        </h4>
                        <p className="text-sm text-red-700 mt-1">
                            Your selling price is less than the minimum allowable blank price.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

}
export default PriceWarning