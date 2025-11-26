import React from "react";
import { Check, X } from "lucide-react";
import type { Plan } from "@/types/subscription";

interface PlanFeaturesProps {
  plan: Plan | null | undefined;
  isCompact?: boolean;
}

export const PlanFeatures: React.FC<PlanFeaturesProps> = ({
  plan,
  isCompact = false,
}) => {
  if (!plan || !plan.features) {
    return null;
  }

  const renderFeatureValue = (key: string, feature: any) => {
    if (feature.type === "boolean") {
      return feature.value ? (
        <span className="flex items-center text-green-600 dark:text-green-400">
          <Check className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{feature.description}</span>
        </span>
      ) : (
        <span className="flex items-center text-gray-400">
          <X className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{feature.description}</span>
        </span>
      );
    } else if (feature.type === "number") {
      return (
        <span className="flex items-center">
          <Check className="h-4 w-4 mr-2 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span>
            {feature.value === null
              ? feature.description.replace(/limited/i, "Unlimited")
              : feature.description}
          </span>
        </span>
      );
    } else if (feature.type === "array" && Array.isArray(feature.value)) {
      return (
        <span className="flex items-center">
          <Check className="h-4 w-4 mr-2 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span>{feature.description}</span>
        </span>
      );
    }
    return null;
  };

  const featureKeys = isCompact
    ? ["productLimit", "collectionLimit", "whiteLabeling", "salesReporting"]
    : Object.keys(plan.features);

  return (
    <div className="space-y-3">
      {featureKeys.map((key) => {
        const feature = plan.features[key];
        if (!feature) return null;

        return (
          <div key={key} className="flex items-start">
            {renderFeatureValue(key, feature)}
          </div>
        );
      })}

      {isCompact && Object.keys(plan.features).length > featureKeys.length && (
        <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
          + {Object.keys(plan.features).length - featureKeys.length} more
          features
        </div>
      )}
    </div>
  );
};
