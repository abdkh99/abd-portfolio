"use client";
import { HighlightText } from "./animate-ui/text/highlight";
import DestinationCard from "./ui/ProjectsCards";
const RecentProjects = () => {
  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        A small selection of <HighlightText text="recent Projects" />
      </h1>
      <div className="mt-20 full">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
          <DestinationCard
            name="Landing Page"
            image="/Landingpage.png"
            tagline="Marketing landing page"
            details={[
              "📱 Responsive mobile-first layout",
              "🎨 Clear CTA with micro-interactions",
              "✨ Smooth scroll animations with Framer Motion",
              "� Optimized for SEO with Next.js",
            ]}
            badges={["React", "TypeScript", "Tailwind", "Vercel"]}
            buttonText="View Project"
            buttonLink="https://landing-page-git-main-abdkh99s-projects.vercel.app/"
          />
          <DestinationCard
            name="Dashboard"
            image="/Dashboard-Project.png"
            tagline="Admin dashboard for monitoring metrics and user data."
            details={[
              "📊 Reusable widgets & cards",
              "🔎 Sortable / searchable tables",
              "📈 Interactive charts and filters",
              "📱 Responsive grid layout",
            ]}
            badges={["React", "Tailwind CSS", "Charts"]}
            buttonText="View Project"
            buttonLink="https://dashboard-ebon-one-52.vercel.app/"
          />
          <DestinationCard
            name="Portfolio"
            image="/Portfolio-Project.png"
            tagline="Personal portfolio to showcase projects and contact info."
            details={[
              "🖼️ Project gallery with live links",
              "📄 Project detail pages",
              "✉️ Contact form / social links",
              "🔎 SEO-friendly structure",
            ]}
            badges={["Next.js", "Tailwind", "Framer Motion"]}
            buttonText="View Project"
            buttonLink="https://abd-portfolio-nm49.vercel.app/"
          />
          <DestinationCard
            name="Xp-Zone Gaming"
            image="/XP-Zone.png"
            tagline="Clone Xp-Zone | Level Up your Gaming Experience "
            details={[
              "🎨 Tailwind CSS for a modern, flexible, and clean design.",
              "� GSAP animations for smooth, game-like effects",
              "📱 Responsive design optimized for all screen sizes",
              "🧭 User-friendly interface with intuitive navigation",
            ]}
            badges={["React", "Tailwind", "Gsap"]}
            buttonText="View Project"
            buttonLink="https://xp-zone-73njj1hhf-abdkh99s-projects.vercel.app"
          />
          <DestinationCard
            name="API Showcase"
            image="/API-Showcase-Project.png"
            tagline="Interactive interface that demonstrates API endpoints and responses."
            details={[
              "🔁 Live request examples",
              "📄 Readable JSON responses",
              "🧾 Endpoint documentation",
              "🧪 Sandbox test requests",
            ]}
            badges={["Next.js", "Fetch/Axios", "tailwind", "nextjs"]}
            buttonText="View Project"
            buttonLink="https://api-show-case-tlno.vercel.app/"
          />
          <DestinationCard
            name="Auth Demo"
            image="/Auth-Demo-Project.png"
            tagline="Authentication flows: register, login, protected routes."
            details={[
              "🔐 Register / Login forms with validation",
              "🛡️ Protected routes & session handling",
              "🔗 OAuth providers (optional)",
              "✅ Clear error & success states",
            ]}
            badges={["Next.js", "NextAuth/Firebase", "Tailwind"]}
            buttonText="View Project"
            buttonLink="https://auth-7ggy.vercel.app/"
          />
          <DestinationCard
            name="E-commerce Mini Store"
            image="/E-commerce-Mini-Store-Project.png"
            tagline="Mini online store with product listing, cart, and checkout flow."
            details={[
              "🛍️ Product listing & product page",
              "🧾 Client-side cart and total calculation",
              "🔍 Filter and sort features",
              "💳 Mock or real payment integration",
            ]}
            badges={["Next.js", "NextAuth/Firebase", "Tailwind", "Typescript"]}
            buttonText="View Project"
            buttonLink="https://e-commerce5-5cwa.vercel.app/"
          />
          <DestinationCard
            name="Sass Landing Page"
            image="/Sass-Landing-page.png"
            tagline="A clean marketing landing page built using Sass (SCSS) for modular styling."
            details={[
              "🎛️ Modular SCSS architecture (partials & variables)",
              "📱 Responsive layout with mobile-first styles",
              "⚡ Lightweight and fast (compiled CSS)",
              "🎨 Easy theme variables (colors/typography)",
            ]}
            badges={["Next.js", "Tailwind", "Vercel"]}
            buttonText="View Project"
            buttonLink="https://sass-landing-page-eta.vercel.app/"
          />
        </div>
      </div>
    </div>
  );
};

export default RecentProjects;
