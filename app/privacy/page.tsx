import { translations } from "@/lib/translations"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{translations.privacyPolicy}</h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">{translations.lastUpdated}: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.informationWeCollect}</h2>
              <p className="text-gray-700 mb-4">
                {translations.informationWeCollectDescription}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.howWeUseYourInformation}</h2>
              <p className="text-gray-700 mb-4">
                {translations.howWeUseYourInformationDescription}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.informationSharing}</h2>
              <p className="text-gray-700 mb-4">
                {translations.informationSharingDescription}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.contactUs}</h2>
              <p className="text-gray-700">
                {translations.contactUsDescription}{" "}
                <a href={`mailto:${translations.privacyEmail}`} className="text-blue-600 hover:underline">
                  {translations.privacyEmail}
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
