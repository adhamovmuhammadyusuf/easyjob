import { translations } from "@/lib/translations"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{translations.helpCenter}</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.frequentlyAskedQuestions}</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{translations.howToCreateAccount}</h3>
                  <p className="text-gray-700">
                    {translations.createAccountDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{translations.howToApplyForJob}</h3>
                  <p className="text-gray-700">
                    {translations.applyForJobDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{translations.howToUploadResume}</h3>
                  <p className="text-gray-700">
                    {translations.uploadResumeDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{translations.howToTrackApplications}</h3>
                  <p className="text-gray-700">
                    {translations.trackApplicationsDescription}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.contactSupport}</h2>
              <p className="text-gray-700 mb-4">
                {translations.contactSupportDescription}
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  {translations.email}:{" "}
                  <a href="mailto:support@easyjob.com" className="text-blue-600 hover:underline">
                    support@easyjob.uz
                  </a>
                </p>
                <p className="text-gray-700">
                  {translations.phone}:{" "}
                  <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                    +998 33 700 78 17
                  </a>
                </p>
                <p className="text-gray-700">{translations.hours}: {translations.mondayFriday}, {translations.hoursTime}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
