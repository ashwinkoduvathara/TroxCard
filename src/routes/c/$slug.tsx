import { createFileRoute } from '@tanstack/react-router'
import { getCardBySlug } from '../../lib/card.functions'
import { themesMap, SampleTheme } from '../../themes'

export const Route = createFileRoute('/c/$slug')({
  loader: async ({ params }) => {
    try {
      const card = await getCardBySlug({ data: params.slug })
      return { card, slug: params.slug }
    } catch (e) {
      return { card: null, slug: params.slug }
    }
  },
  component: PublicCardViewer,
})

function PublicCardViewer() {
  const loaderData = Route.useLoaderData()
  const card = loaderData?.card

  // Fallback mock data matching uploaded screenshot if card is empty
  const cardData = card || {
    fullName: 'Ashwin Baby',
    jobTitle: 'Founder & CEO',
    company: 'Kodeversity Technologies Pvt. Ltd.',
    aboutBio: 'Building digital products & AI solutions that drive real impact.',
    phone: '+91 7356 567 890',
    email: 'ashwin@kodeversity.com',
    website: 'https://kodeversity.com',
    location: 'Kerala, India',
    brochureName: 'Company_Brochure.pdf',
    ctaText: 'Book a Meeting',
    theme: 'sample',
  }

  const ThemeComponent = themesMap[cardData.theme || 'sample'] || SampleTheme
  return <ThemeComponent card={cardData} />
}
