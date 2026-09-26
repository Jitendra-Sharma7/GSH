"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { mockCountries } from "@/lib/data/mock-countries";
import { mockFields } from "@/lib/data/mock-fields";
import { api } from "@/lib/data/store";
import { ScholarshipData } from "@/lib/data/mock-scholarships";
import { ScholarshipCard } from "@/components/scholarships/ScholarshipCard";

interface MatchResultItem {
  scholarship: ScholarshipData;
  score: number;
  reasons: string[];
  missing?: string[];
  warnings?: string[];
}

interface FormData {
  citizenship: string;
  field: string;
  degreeLevel: string;
  targetCountries: string[];
  gpa: string;
  languageScore: string;
  needFullFunding: boolean;
  startYear: string;
  experience: string;
  priority: string;
}

export default function ScholarshipFinderPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResultItem[] | null>(null);

  // Form State across 10 steps
  const [formData, setFormData] = useState<FormData>({
    citizenship: "np", // Nepal or other country as default
    field: "Computer Science",
    degreeLevel: "Master's",
    targetCountries: ["de", "us", "gb"],
    gpa: "3.7",
    languageScore: "IELTS 7.0+",
    needFullFunding: true,
    startYear: "2027",
    experience: "1-2 Years Professional Experience",
    priority: "Full Tuition + Living Expenses",
  });

  // Keyed generic so each field keeps its own value type instead of collapsing to any.
  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 10) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const gpaNum = parseFloat(formData.gpa) || 3.5;
      const matched = await api.findMatches({
        citizenship: formData.citizenship,
        field: formData.field,
        degreeLevel: formData.degreeLevel,
        targetCountries: formData.targetCountries,
        gpa: gpaNum,
        needFullFunding: formData.needFullFunding,
      });
      setResults(matched);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setStep(1);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <Container size="md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-primary-600" />
            <span>AI Eligibility & Scholarship Matcher</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">
            Scholarship Finder
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
            Answer 10 brief questions to receive calculated matches with clear explanations of your eligibility.
          </p>
        </div>

        {/* Results View */}
        {results !== null ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-emerald-950">
                    We Found {results.length} Potential Scholarship Matches!
                  </h2>
                  <p className="text-xs text-emerald-800 mt-1">
                    Ranked by alignment with your degree, field, target countries, and funding preferences.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Start Over
                </button>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 rounded-xl bg-white/80 p-3 text-xs text-gray-600 border border-emerald-100 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Important Notice:</strong> Matches are algorithmic recommendations based on your inputs and do not guarantee formal admission or funding. Always verify official requirements directly with the provider.
                </span>
              </div>
            </div>

            {/* Match Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {results.map((res) => (
                <ScholarshipCard
                  key={res.scholarship.id}
                  scholarship={res.scholarship}
                  matchScore={res.score}
                  matchReasons={res.reasons}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Questionnaire Wizard Container */
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                <span>Step {step} of 10</span>
                <span>{step * 10}% Completed</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-300 rounded-full"
                  style={{ width: `${step * 10}%` }}
                />
              </div>
            </div>

            {/* STEP CONTENT */}
            <div className="min-h-[280px]">
              {/* Step 1: Citizenship */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">1. Where are you from? (Country of Citizenship)</h3>
                  <p className="text-xs text-gray-500">Many international scholarships have specific bilateral or regional quotas.</p>
                  <select
                    value={formData.citizenship}
                    onChange={(e) => updateField("citizenship", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    <option value="np">Nepal</option>
                    <option value="in">India</option>
                    <option value="pk">Pakistan</option>
                    <option value="ng">Nigeria</option>
                    <option value="ke">Kenya</option>
                    <option value="gh">Ghana</option>
                    <option value="bd">Bangladesh</option>
                    <option value="id">Indonesia</option>
                    <option value="vn">Vietnam</option>
                    <option value="br">Brazil</option>
                    <option value="mx">Mexico</option>
                    <option value="eg">Egypt</option>
                    <option value="other">Other Developing Nation / Global</option>
                  </select>
                </div>
              )}

              {/* Step 2: Field */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">2. What do you want to study? (Field of Study)</h3>
                  <p className="text-xs text-gray-500">Select your intended major or research discipline.</p>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {mockFields.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateField("field", f.name)}
                        className={`rounded-xl border p-3 text-left text-xs font-semibold transition-colors ${
                          formData.field === f.name
                            ? "border-primary-600 bg-primary-50 text-primary-900"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="truncate">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Degree */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">3. What degree level are you applying for?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "Undergraduate", label: "Undergraduate / Bachelor's" },
                      { id: "Master's", label: "Master's / Postgraduate" },
                      { id: "PhD", label: "PhD / Doctoral Degree" },
                      { id: "Postdoctoral", label: "Postdoctoral / Fellowship" },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => updateField("degreeLevel", d.id)}
                        className={`rounded-xl border p-4 text-left font-semibold text-sm transition-colors ${
                          formData.degreeLevel === d.id
                            ? "border-primary-600 bg-primary-50 text-primary-900"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Destination countries */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">4. Where would you like to study?</h3>
                  <p className="text-xs text-gray-500">Select one or more destination preferences.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {mockCountries.slice(0, 9).map((c) => {
                      const selected = formData.targetCountries.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            if (selected) {
                              updateField(
                                "targetCountries",
                                formData.targetCountries.filter((id) => id !== c.id)
                              );
                            } else {
                              updateField("targetCountries", [...formData.targetCountries, c.id]);
                            }
                          }}
                          className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-colors ${
                            selected
                              ? "border-primary-600 bg-primary-50 text-primary-900"
                              : "border-gray-200 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <CountryFlag
                            code={c.code}
                            emoji={c.flag}
                            name={c.name}
                            size="sm"
                          />
                          <span className="truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Academic Performance (GPA) */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">5. What is your academic performance (GPA)?</h3>
                  <p className="text-xs text-gray-500">Approximate equivalent on a 4.0 scale.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: "3.8", label: "3.8 - 4.0 (Top 5% / First Class Honours)" },
                      { val: "3.5", label: "3.5 - 3.79 (High Distinction)" },
                      { val: "3.0", label: "3.0 - 3.49 (Good Academic Standing)" },
                      { val: "2.5", label: "Below 3.0" },
                    ].map((g) => (
                      <button
                        key={g.val}
                        type="button"
                        onClick={() => updateField("gpa", g.val)}
                        className={`rounded-xl border p-4 text-left font-semibold text-sm transition-colors ${
                          formData.gpa === g.val
                            ? "border-primary-600 bg-primary-50 text-primary-900"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Language Score */}
              {step === 6 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">6. What is your English / Language proficiency?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: "IELTS 7.5+", label: "IELTS 7.5+ / TOEFL 105+ (Fluent)" },
                      { val: "IELTS 6.5 - 7.0", label: "IELTS 6.5 - 7.0 / TOEFL 90-100 (Competent)" },
                      { val: "IELTS 6.0", label: "IELTS 6.0 / TOEFL 80 (Moderate)" },
                      { val: "No Test Yet", label: "Haven't taken a test yet / Require waiver" },
                    ].map((l) => (
                      <button
                        key={l.val}
                        type="button"
                        onClick={() => updateField("languageScore", l.val)}
                        className={`rounded-xl border p-4 text-left font-semibold text-sm transition-colors ${
                          formData.languageScore === l.val
                            ? "border-primary-600 bg-primary-50 text-primary-900"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Funding Need */}
              {step === 7 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">7. Do you require full funding?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateField("needFullFunding", true)}
                      className={`rounded-xl border p-4 text-left font-semibold text-sm transition-colors ${
                        formData.needFullFunding === true
                          ? "border-primary-600 bg-primary-50 text-primary-900"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      Yes, I require 100% full funding (Tuition + Living Stipend)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("needFullFunding", false)}
                      className={`rounded-xl border p-4 text-left font-semibold text-sm transition-colors ${
                        formData.needFullFunding === false
                          ? "border-primary-600 bg-primary-50 text-primary-900"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      Partial funding or tuition waiver is sufficient
                    </button>
                  </div>
                </div>
              )}

              {/* Step 8: Start Date */}
              {step === 8 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">8. When do you plan to start studying?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["Fall 2027", "Spring 2027", "2028 or Later"].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => updateField("startYear", yr)}
                        className={`rounded-xl border p-4 text-left font-semibold text-sm transition-colors ${
                          formData.startYear === yr
                            ? "border-primary-600 bg-primary-50 text-primary-900"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 9: Work / Research Exp */}
              {step === 9 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">9. Do you have relevant work or research experience?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "2+ Years Professional Work Experience",
                      "Academic Research & Publications",
                      "Community Leadership & Volunteering",
                      "Fresh Graduate / No Prior Experience",
                    ].map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => updateField("experience", exp)}
                        className={`rounded-xl border p-4 text-left font-semibold text-sm transition-colors ${
                          formData.experience === exp
                            ? "border-primary-600 bg-primary-50 text-primary-900"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 10: Priority */}
              {step === 10 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">10. What is most important to you?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Maximum Financial Support",
                      "University Prestige & Global Ranking",
                      "Post-Study Work Permit & Visa Ease",
                      "Low Application / Admission Barriers",
                    ].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => updateField("priority", p)}
                        className={`rounded-xl border p-4 text-left font-semibold text-sm transition-colors ${
                          formData.priority === p
                            ? "border-primary-600 bg-primary-50 text-primary-900"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
              <button
                type="button"
                disabled={step === 1}
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-700 disabled:opacity-60"
              >
                {loading ? (
                  <span>Analyzing Eligibility...</span>
                ) : step === 10 ? (
                  <>
                    <span>Generate Matches</span>
                    <Sparkles className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Next Step</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
