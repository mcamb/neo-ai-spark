import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { countryNames } from '@/utils/clientDataUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import {
  Chart as ChartComponent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SocialMediaScore {
  platform: string;
  score: number;
  rationale: string;
}

interface ClientDetails {
  id: string;
  name: string;
  country: string;
  domain: string;
  logo?: string;
  description: string;
  brandPromise: string;
  brandChallenge: string;
  targetAudience: {
    b2c: {
      primary: string;
      secondary: string;
    };
    b2b: {
      primary: string;
      secondary: string;
    };
  };
  socialMediaScores: SocialMediaScore[];
}

// Mock data for demonstration
const mockClientDetails: Record<string, ClientDetails> = {
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
      rationale: "Minimal presence and engagement. Demographics don't strongly align with our primary target audience. Limited ROI for current marketing efforts."
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

const ClientDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [audienceType, setAudienceType] = useState<'b2c' | 'b2b'>('b2c');

  // In a real application, you would fetch the client details from an API or database
  const clientDetails = mockClientDetails[clientId as string];

  // Prepare chart data
  const chartData = clientDetails?.socialMediaScores.map(item => ({
    name: item.platform,
    score: item.score,
  })) || [];

  if (!clientDetails) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/clients')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
          </div>
          <div className="flex items-center justify-center p-10 border border-dashed rounded-lg">
            <div className="text-center">
              <p className="text-gray-500">Client not found.</p>
              <p className="text-sm text-gray-400 mt-1">The requested client could not be found.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
        
        {/* Header Section - Redesigned */}
        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
          <div className="flex items-start gap-4">
            {/* Logo moved to left */}
            <Avatar className="h-16 w-16 bg-gray-100">
              {clientDetails.logo ? (
                <AvatarImage src={clientDetails.logo} alt={clientDetails.name} />
              ) : (
                <AvatarFallback className="text-gray-700 text-xl">
                  {clientDetails.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="space-y-2">
              {/* Client name and country */}
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{clientDetails.name}</h1>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded-md">{countryNames[clientDetails.country]}</span>
              </div>
              
              {/* Domain to the left */}
              <div className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-neo-red" />
                <a 
                  href={`https://${clientDetails.domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-neo-red hover:underline"
                >
                  {clientDetails.domain}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description - Now separate section */}
        <div className="pb-6 border-b">
          <p className="text-gray-600">{clientDetails.description}</p>
        </div>
        
        {/* Brand Intelligence Section - Reorganized */}
        <Card className="border-none shadow-sm bg-gray-50">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Brand</h2>
              <Button variant="ghost" size="sm">
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Brand Promise</h3>
                <p className="text-gray-600 bg-white p-4 rounded-md">{clientDetails.brandPromise}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Brand Challenge</h3>
                <p className="text-gray-600 bg-white p-4 rounded-md">{clientDetails.brandChallenge}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Target Audience Section - With toggle */}
        <Card className="border-none shadow-sm bg-gray-50">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Target Audience</h2>
              <Button variant="ghost" size="sm">
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Toggle between B2C and B2B */}
              <RadioGroup 
                value={audienceType} 
                onValueChange={(value) => setAudienceType(value as 'b2c' | 'b2b')}
                className="flex space-x-4 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="b2c" id="b2c" />
                  <label htmlFor="b2c" className="cursor-pointer font-medium">B2C Audience</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="b2b" id="b2b" />
                  <label htmlFor="b2b" className="cursor-pointer font-medium">B2B Audience</label>
                </div>
              </RadioGroup>
              
              {/* Show selected audience type */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Primary</h4>
                  <div className="bg-white p-4 rounded-md">
                    <p className="text-gray-600 text-sm">{clientDetails.targetAudience[audienceType].primary}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Secondary</h4>
                  <div className="bg-white p-4 rounded-md">
                    <p className="text-gray-600 text-sm">{clientDetails.targetAudience[audienceType].secondary}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Social Media Relevance Scores with Bar Chart */}
        <Card className="border-none shadow-sm bg-gray-50">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Relevance Score</h2>
              <Button variant="ghost" size="sm">
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </Button>
            </div>
            
            {/* Bar Chart */}
            <div className="h-72 bg-white p-4 rounded-md">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.sort((a, b) => b.score - a.score)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80} 
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}/100`, 'Score']} 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#ea384c" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Progress Bars - keeping as alternative view */}
            <div className="space-y-4 bg-white p-4 rounded-md">
              {clientDetails.socialMediaScores.sort((a, b) => b.score - a.score).map(item => (
                <div key={item.platform} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.platform}</span>
                    <span className="text-sm font-mono">{item.score}/100</span>
                  </div>
                  <Progress 
                    value={item.score} 
                    className="h-2" 
                    style={{
                      ['--tw-bg-opacity' as any]: '0.15',
                      backgroundColor: 'rgba(234, 56, 76, var(--tw-bg-opacity))'
                    }} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Rationale Section with First Accordion Open */}
        <Card className="border-none shadow-sm bg-gray-50">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Relevance Score Rationale</h2>
              <Button variant="ghost" size="sm">
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </Button>
            </div>
            
            <Accordion type="single" defaultValue="item-0" collapsible className="w-full">
              {clientDetails.socialMediaScores.sort((a, b) => b.score - a.score).map((item, index) => (
                <AccordionItem key={item.platform} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">{item.platform} ({item.score})</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{item.rationale}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClientDetailsPage;
