
import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 7.0 ? 'text-green-600'
            : score > 4.9
        ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-2xl">
                    <span className={textColor}>{score}</span>/10
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

         <Category title="ATS Compatibility" score={feedback.ats_compatibility ?? 0} />
        <Category title="Content Relevance" score={feedback.job_fit_analysis.match_score ?? 0} />
        <Category title="Structure & Formatting" score={feedback.formatting_score ?? 0} />
        <Category title="Keyword Optimization" score={feedback.keyword_optimization ?? 0} />

        </div>
    )
}
export default Summary
