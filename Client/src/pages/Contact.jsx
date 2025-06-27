// import React, { useState } from "react";
// import { PageWrapper } from "@/components/layout/PageWrapper";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   MessageCircle,
//   HelpCircle,
//   Bug,
//   Lightbulb,
//   Send,
//   CheckCircle,
// } from "lucide-react";

// const Contact = () => {
//   const { toast } = useToast();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     category: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const contactInfo = [
//     {
//       icon: Mail,
//       title: "Email Us",
//       content: "support@bloghub.com",
//       description: "Send us an email anytime",
//     },
//     {
//       icon: Phone,
//       title: "Call Us",
//       content: "+1 (555) 123-4567",
//       description: "Mon-Fri from 8am to 6pm",
//     },
//     {
//       icon: MapPin,
//       title: "Visit Us",
//       content: "123 Creator Street, San Francisco, CA 94107",
//       description: "Our office address",
//     },
//     {
//       icon: Clock,
//       title: "Business Hours",
//       content: "Mon-Fri: 8am-6pm PST",
//       description: "We're here to help",
//     },
//   ];

//   const categories = [
//     { value: "general", label: "General Inquiry", icon: MessageCircle },
//     { value: "support", label: "Technical Support", icon: HelpCircle },
//     { value: "bug", label: "Bug Report", icon: Bug },
//     { value: "feature", label: "Feature Request", icon: Lightbulb },
//     { value: "business", label: "Business Partnership", icon: Mail },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate API call
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       setIsSubmitted(true);
//       toast({
//         title: "Message Sent!",
//         description:
//           "Thank you for contacting us. We'll get back to you within 24 hours.",
//       });

//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         subject: "",
//         category: "",
//         message: "",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <PageWrapper className="py-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Hero Section */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6">
//             Get in <span className="text-primary">Touch</span>
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
//             Have a question, suggestion, or just want to say hello? We'd love to
//             hear from you. Our team is here to help you make the most of your
//             BlogHub experience.
//           </p>
//         </div>

//         {/* Contact Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//           {contactInfo.map((info, index) => {
//             const Icon = info.icon;
//             return (
//               <Card
//                 key={index}
//                 className="text-center hover:shadow-lg transition-shadow"
//               >
//                 <CardContent className="pt-6">
//                   <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
//                     <Icon className="h-6 w-6 text-primary" />
//                   </div>
//                   <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
//                   <p className="font-medium mb-1">{info.content}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {info.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Contact Form */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-2xl">Send us a Message</CardTitle>
//               <p className="text-muted-foreground">
//                 Fill out the form below and we'll get back to you as soon as
//                 possible.
//               </p>
//             </CardHeader>
//             <CardContent>
//               {isSubmitted && (
//                 <Alert className="mb-6 border-green-200 bg-green-50">
//                   <CheckCircle className="h-4 w-4 text-green-600" />
//                   <AlertDescription className="text-green-800">
//                     Your message has been sent successfully! We'll respond
//                     within 24 hours.
//                   </AlertDescription>
//                 </Alert>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="name">Full Name *</Label>
//                     <Input
//                       id="name"
//                       name="name"
//                       type="text"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       disabled={isSubmitting}
//                       placeholder="John Doe"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="email">Email *</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       disabled={isSubmitting}
//                       placeholder="john@example.com"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="category">Category *</Label>
//                   <select
//                     id="category"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     required
//                     disabled={isSubmitting}
//                     className="w-full p-2 border border-input rounded-md bg-background"
//                   >
//                     <option value="">Select a category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.value} value={cat.value}>
//                         {cat.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <Label htmlFor="subject">Subject *</Label>
//                   <Input
//                     id="subject"
//                     name="subject"
//                     type="text"
//                     value={formData.subject}
//                     onChange={handleInputChange}
//                     required
//                     disabled={isSubmitting}
//                     placeholder="Brief description of your inquiry"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="message">Message *</Label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     required
//                     disabled={isSubmitting}
//                     rows={6}
//                     className="w-full p-3 border border-input rounded-md bg-background resize-none"
//                     placeholder="Tell us more about your inquiry..."
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4 mr-2" />
//                       Send Message
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* FAQ Section */}
//           <div>
//             <Card className="mb-8">
//               <CardHeader>
//                 <CardTitle className="text-2xl">
//                   Frequently Asked Questions
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div>
//                   <h4 className="font-semibold mb-2">
//                     How do I reset my password?
//                   </h4>
//                   <p className="text-sm text-muted-foreground">
//                     You can reset your password by clicking "Forgot Password" on
//                     the login page or by going to your profile settings.
//                   </p>
//                 </div>

//                 <div>
//                   <h4 className="font-semibold mb-2">
//                     Can I customize my blog's appearance?
//                   </h4>
//                   <p className="text-sm text-muted-foreground">
//                     Yes! BlogHub offers various customization options including
//                     themes, fonts, and layout settings in your dashboard.
//                   </p>
//                 </div>

//                 <div>
//                   <h4 className="font-semibold mb-2">
//                     Is BlogHub free to use?
//                   </h4>
//                   <p className="text-sm text-muted-foreground">
//                     BlogHub offers both free and premium plans. The free plan
//                     includes basic blogging features, while premium plans offer
//                     advanced tools.
//                   </p>
//                 </div>

//                 <div>
//                   <h4 className="font-semibold mb-2">
//                     How do I delete my account?
//                   </h4>
//                   <p className="text-sm text-muted-foreground">
//                     You can delete your account from your profile settings.
//                     Please note that this action is irreversible.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Response Time Card */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Response Times</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">General Inquiries</span>
//                   <span className="text-sm text-primary font-medium">
//                     24 hours
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Technical Support</span>
//                   <span className="text-sm text-primary font-medium">
//                     12 hours
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Bug Reports</span>
//                   <span className="text-sm text-primary font-medium">
//                     6 hours
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Business Inquiries</span>
//                   <span className="text-sm text-primary font-medium">
//                     48 hours
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Additional Contact Methods */}
//         <div className="mt-16 text-center">
//           <Card className="bg-primary/5 border-primary/20">
//             <CardContent className="pt-8 pb-8">
//               <h2 className="text-2xl font-bold mb-4">
//                 Other Ways to Reach Us
//               </h2>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <a
//                   href="https://twitter.com/bloghub"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-semibold transition-colors"
//                 >
//                   Follow us on Twitter
//                 </a>
//                 <a
//                   href="https://github.com/bloghub"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-semibold transition-colors"
//                 >
//                   Contribute on GitHub
//                 </a>
//                 <a
//                   href="/help"
//                   className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-semibold transition-colors"
//                 >
//                   Browse Help Center
//                 </a>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </PageWrapper>
//   );
// };

// export default Contact;


import React, { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  Send,
  CheckCircle,
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@bloghub.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Creator Street, San Francisco, CA 94107",
      description: "Our office address",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 8am-6pm PST",
      description: "We're here to help",
    },
  ];

  const categories = [
    { value: "general", label: "General Inquiry", icon: MessageCircle },
    { value: "support", label: "Technical Support", icon: HelpCircle },
    { value: "bug", label: "Bug Report", icon: Bug },
    { value: "feature", label: "Feature Request", icon: Lightbulb },
    { value: "business", label: "Business Partnership", icon: Mail },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description:
          "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have a question, suggestion, or just want to say hello? We'd love to
            hear from you. Our team is here to help you make the most of your
            BlogHub experience.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                  <p className="font-medium mb-1">{info.content}</p>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>
            </CardHeader>
            <CardContent>
              {isSubmitted && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your message has been sent successfully! We'll respond
                    within 24 hours.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows={6}
                    className="w-full p-3 border border-input rounded-md bg-background resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">
                    How do I reset my password?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You can reset your password by clicking "Forgot Password" on
                    the login page or by going to your profile settings.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    Can I customize my blog's appearance?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! BlogHub offers various customization options including
                    themes, fonts, and layout settings in your dashboard.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    Is BlogHub free to use?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    BlogHub offers both free and premium plans. The free plan
                    includes basic blogging features, while premium plans offer
                    advanced tools.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    How do I delete my account?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You can delete your account from your profile settings.
                    Please note that this action is irreversible.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Card */}
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">General Inquiries</span>
                  <span className="text-sm text-primary font-medium">
                    24 hours
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Technical Support</span>
                  <span className="text-sm text-primary font-medium">
                    12 hours
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bug Reports</span>
                  <span className="text-sm text-primary font-medium">
                    6 hours
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Business Inquiries</span>
                  <span className="text-sm text-primary font-medium">
                    48 hours
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Contact Methods */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">
                Other Ways to Reach Us
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://twitter.com/bloghub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Follow us on Twitter
                </a>
                <a
                  href="https://github.com/bloghub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Contribute on GitHub
                </a>
                <a
                  href="/help"
                  className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Browse Help Center
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Contact;
