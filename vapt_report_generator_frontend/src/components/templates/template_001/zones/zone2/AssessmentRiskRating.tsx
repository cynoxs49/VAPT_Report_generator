import type { Severity } from "@/constants/enums";

interface AssessmentRiskRatingProps {
  overallRiskRating: Severity;
}

const matrixRows = [
  ["High", "High", "Critical"],
  ["Medium", "Medium", "High"],
  ["Low", "Low", "Medium"],
] as const;

export function AssessmentRiskRating({
  overallRiskRating,
}: AssessmentRiskRatingProps) {
  return (
    <div className="t-prose">
      <p>
        Cynox calculates finding risk based on exploitation likelihood and
        potential business impact to the environment.
      </p>
      <p>
        The overall risk rating that was determined for this scope:{" "}
        <strong>{overallRiskRating}</strong>
      </p>

      <table className="t-risk-matrix">
        <thead>
          <tr>
            <th>Impact</th>
            <th>Low Likelihood</th>
            <th>High Likelihood</th>
          </tr>
        </thead>
        <tbody>
          {matrixRows.map(([impact, low, high]) => (
            <tr key={impact}>
              <th>{impact}</th>
              {[low, high].map((rating) => (
                <td
                  key={`${impact}-${rating}`}
                  className={
                    rating === overallRiskRating
                      ? "t-risk-highlight"
                      : undefined
                  }>
                  {rating}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
