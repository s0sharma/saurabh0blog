import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  const skills = [
    "TypeScript", "Node.js", "React", "Next.js", "PostgreSQL", 
    "Docker", "AWS", "Kubernetes", "Python", "Go"
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <p className="text-gray-600 dark:text-gray-300">Software engineer passionate about building scalable systems</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
              alt="Profile photo"
              className="w-64 h-64 rounded-xl object-cover mx-auto shadow-lg"
            />
          </div>

          <div className="lg:col-span-2">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Hi! I'm a senior software engineer with over 8 years of experience building scalable web applications 
                and distributed systems. I'm passionate about clean code, system design, and sharing knowledge with 
                the developer community.
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Currently, I work as a principal engineer at a fast-growing fintech startup, where I lead the platform 
                architecture team. I specialize in microservices, event-driven architecture, and building systems that 
                can handle millions of transactions per day.
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                When I'm not coding, you can find me contributing to open source projects, mentoring junior developers, 
                or exploring the latest trends in technology. I believe in continuous learning and sharing knowledge 
                through writing and speaking.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    data-testid={`skill-${skill.toLowerCase().replace(/\./g, '-')}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <Link href="/contact">
                  <Button data-testid="contact-button">
                    Get In Touch
                  </Button>
                </Link>
                <Button variant="outline" data-testid="resume-button">
                  Download Resume
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
