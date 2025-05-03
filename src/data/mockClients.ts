
import { ClientDetails } from '@/models/clientDetails';

// Mock data for demonstration
export const mockClientDetails: Record<string, ClientDetails> = {
  '1': {
    id: '1',
    name: 'Acme Corp',
    country: 'us',
    domain: 'acme.com',
    description: 'Global leader in innovative solutions across multiple sectors, focusing on sustainability and cutting-edge technologies.',
    brandPromise: 'Acme Corp is committed to providing reliable, innovative solutions that solve real-world problems. Our brand stands for quality, trust, and forward-thinking approaches to everyday challenges.',
    brandChallenge: 'In a rapidly evolving marketplace, Acme Corp must balance its established reputation with the need to embrace new technologies and appeal to younger demographics while maintaining loyalty from traditional customers.',
    targetAudience: {
      b2c: {
        primary: 'Tech-savvy consumers aged 25-45 who value innovation and quality over price, primarily in urban centers and with disposable income for premium products.',
        secondary: 'Budget-conscious families looking for reliable household solutions with good value for money, typically suburban homeowners with children.'
      },
      b2b: {
        primary: 'Medium to large enterprises in the manufacturing and technology sectors seeking integrated solutions for operational efficiency and digital transformation.',
        secondary: 'Small businesses and startups looking for scalable tools and services to support rapid growth and competitive positioning.'
      }
    },
    socialMediaScores: [{
      platform: 'Instagram',
      score: 85,
      rationale: 'High engagement rates on product showcases and lifestyle content, particularly with the 25-35 demographic. Visual platform aligns well with our product design emphasis.'
    }, {
      platform: 'YouTube',
      score: 75,
      rationale: 'Strong performance on tutorial and behind-the-scenes content. Educational videos about product features receive significant watch time.'
    }, {
      platform: 'TikTok',
      score: 65,
      rationale: 'Growing presence with potential for viral content, particularly when highlighting product innovation. Currently underutilized but showing promising engagement metrics.'
    }, {
      platform: 'Facebook',
      score: 55,
      rationale: 'Declining organic reach but still valuable for community building and customer service. Higher engagement with older demographics.'
    }, {
      platform: 'LinkedIn',
      score: 90,
      rationale: 'Excellent platform for B2B outreach, thought leadership content, and recruitment. Our industry expertise content performs exceptionally well.'
    }, {
      platform: 'WhatsApp',
      score: 40,
      rationale: 'Limited direct marketing use but potential for customer service applications and community building. Privacy concerns limit widespread adoption for marketing.'
    }, {
      platform: 'Snapchat',
      score: 30,
      rationale: 'Minimal presence and engagement. Demographics don\'t strongly align with our primary target audience. Limited ROI for current marketing efforts.'
    }]
  },
  '2': {
    id: '2',
    name: 'Globex Industries',
    country: 'uk',
    domain: 'globex.co.uk',
    description: 'Leading provider of industrial solutions with a focus on sustainability and innovation in manufacturing processes.',
    brandPromise: 'Globex Industries promises to deliver industrial excellence through sustainable practices and cutting-edge manufacturing technology, ensuring clients receive products that exceed both quality and environmental standards.',
    brandChallenge: 'Balancing traditional industrial processes with modern ecological demands while maintaining competitive pricing in a global market increasingly dominated by lower-cost manufacturers.',
    targetAudience: {
      b2c: {
        primary: 'Environmentally conscious consumers with higher disposable income seeking long-lasting, sustainably produced household and personal items.',
        secondary: 'Professional tradespersons looking for reliable, high-performance tools and equipment for daily commercial use.'
      },
      b2b: {
        primary: 'Manufacturing companies seeking to modernize their production lines with eco-friendly equipment and processes that meet international sustainability certifications.',
        secondary: 'Retail businesses looking for ethically produced wholesale goods to satisfy increasing consumer demand for sustainable products.'
      }
    },
    socialMediaScores: [{
      platform: 'Instagram',
      score: 45,
      rationale: 'Limited appeal for industrial products, though facility tours and behind-the-scenes content shows some engagement. Not aligned with primary audience.'
    }, {
      platform: 'YouTube',
      score: 80,
      rationale: 'Strong performance with technical demonstrations, case studies, and educational content about industrial processes and sustainability initiatives.'
    }, {
      platform: 'TikTok',
      score: 25,
      rationale: 'Very limited relevance for industrial B2B marketing. Experimental presence only with minimal engagement metrics.'
    }, {
      platform: 'Facebook',
      score: 60,
      rationale: 'Moderate engagement with industry news and corporate announcements. Useful for targeted advertising to specific business demographics.'
    }, {
      platform: 'LinkedIn',
      score: 95,
      rationale: 'Primary social channel with excellent engagement on industry thought leadership, technical white papers, and recruitment. Key platform for B2B lead generation.'
    }, {
      platform: 'WhatsApp',
      score: 30,
      rationale: 'Used primarily for internal communications and limited client service channels. Not a significant marketing platform.'
    }, {
      platform: 'Snapchat',
      score: 10,
      rationale: 'Minimal relevance for industrial B2B marketing. No active presence or strategic value identified.'
    }]
  },
  '3': {
    id: '3',
    name: 'TechFuture',
    country: 'ca',
    domain: 'techfuture.ca',
    description: 'Pioneering tech company focused on next-generation software solutions and AI integration for businesses and consumers.',
    brandPromise: "TechFuture is dedicated to creating accessible technology that makes tomorrow's innovations available today, with a focus on intuitive design and seamless integration into everyday life.",
    brandChallenge: 'Standing out in an oversaturated tech market while convincing potential customers that complex AI solutions can be user-friendly and provide meaningful value to their specific use cases.',
    targetAudience: {
      b2c: {
        primary: 'Early technology adopters aged 20-40 with above-average income, higher education levels, and interest in being first to experience new digital solutions.',
        secondary: 'Professional knowledge workers seeking productivity enhancements and simplified digital workflows across multiple devices and platforms.'
      },
      b2b: {
        primary: 'Forward-thinking medium to large enterprises looking to implement AI solutions to improve efficiency, customer insights, and competitive advantage.',
        secondary: 'Educational institutions and research organizations requiring advanced data processing tools and collaborative platforms for complex projects.'
      }
    },
    socialMediaScores: [{
      platform: 'Instagram',
      score: 70,
      rationale: 'Good engagement with product lifestyle photography and tech culture content. Works well for building brand personality and reaching younger demographics.'
    }, {
      platform: 'YouTube',
      score: 85,
      rationale: 'Excellent performance with product demonstrations, tutorials, and thought leadership discussions. High watch time and subscription conversion rates.'
    }, {
      platform: 'TikTok',
      score: 75,
      rationale: 'Strong growth with short-form tech tips, behind-the-scenes development content, and tech humor reaching new audiences effectively.'
    }, {
      platform: 'Facebook',
      score: 50,
      rationale: 'Moderate engagement primarily with older demographics. Useful for community management and customer support but limited organic reach.'
    }, {
      platform: 'LinkedIn',
      score: 85,
      rationale: 'Valuable for B2B marketing, recruitment, and establishing thought leadership in AI and technology domains. Good lead generation performance.'
    }, {
      platform: 'WhatsApp',
      score: 35,
      rationale: 'Limited direct marketing application, though showing promise for personalized customer support and beta testing communication channels.'
    }, {
      platform: 'Snapchat',
      score: 55,
      rationale: 'Moderate relevance for reaching younger demographics with AR product experiences and quick feature announcements. Growing engagement metrics.'
    }]
  }
};
