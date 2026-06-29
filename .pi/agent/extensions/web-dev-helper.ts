import { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default async function (pi: ExtensionAPI) {
  // Register a tool to analyze and optimize HTML structure
  pi.registerTool({
    name: "analyze_html_structure",
    description: "Analyze the HTML structure of web pages for optimization opportunities, accessibility issues, and best practices",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Path to the HTML file to analyze"
        }
      },
      required: ["file_path"]
    },
    handler: async ({ file_path }) => {
      try {
        const content = await pi.tools.read({ path: file_path });
        // Simple analysis for demonstration
        const lines = content.split('\n');
        let issues = [];
        let suggestions = [];
        
        // Check for head elements
        if (!content.includes('<head>')) {
          issues.push("Missing <head> element");
        }
        
        // Check for meta viewport
        if (!content.includes('viewport')) {
          suggestions.push("Add meta viewport tag for responsive design");
        }
        
        // Check for title
        if (!content.includes('<title>')) {
          issues.push("Missing <title> element");
        }
        
        // Count h1 tags
        const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
        if (h1Count === 0) {
          suggestions.push("Add at least one <h1> tag for SEO and accessibility");
        } else if (h1Count > 1) {
          suggestions.push(`Consider reducing H1 tags to one for better SEO structure (found: ${h1Count})`);
        }
        
        // Check for alt attributes
        const imgTags = content.match(/<img[^>]*>/gi) || [];
        const imagesWithoutAlt = imgTags.filter(tag => !tag.includes('alt=')).length;
        if (imagesWithoutAlt > 0) {
          suggestions.push(`Found ${imagesWithoutAlt} images without alt attributes - important for accessibility`);
        }
        
        return {
          file: file_path,
          analysis: {
            issues,
            suggestions,
            total_lines: lines.length
          }
        };
      } catch (error) {
        return { error: `Failed to analyze HTML: ${error.message}` };
      }
    }
  });

  // Register a tool to generate HTML templates
  pi.registerTool({
    name: "generate_html_template",
    description: "Generate reusable HTML templates for web development components",
    parameters: {
      type: "object",
      properties: {
        component_type: {
          type: "string",
          description: "Type of component template to generate (header, footer, card, etc.)"
        },
        structure: {
          type: "string",
          description: "Template structure definition"
        }
      },
      required: ["component_type"]
    },
    handler: async ({ component_type, structure }) => {
      const templates: Record<string, string> = {
        header: `
<header class="bg-base text-text p-4">
  <nav class="container mx-auto flex justify-between items-center">
    <div class="text-xl font-bold">My Website</div>
    <ul class="flex space-x-4">
      <li><a href="#home" class="hover:text-accent">Home</a></li>
      <li><a href="#about" class="hover:text-accent">About</a></li>
      <li><a href="#contact" class="hover:text-accent">Contact</a></li>
    </ul>
  </nav>
</header>
        `,
        footer: `
<footer class="bg-base text-text p-6 mt-8">
  <div class="container mx-auto text-center">
    <p>&copy; 2025 My Website. All rights reserved.</p>
  </div>
</footer>
        `,
        card: `
<div class="bg-card rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
  <img src="/path/to/image.jpg" alt="Card image" class="w-full h-48 object-cover">
  <div class="p-6">
    <h3 class="text-xl font-bold mb-2">Card Title</h3>
    <p class="text-text-muted">Card description goes here.</p>
  </div>
</div>
        `
      };

      return {
        component: component_type,
        template: templates[component_type] || "Template not found for this component type",
        notes: "`component_type` must be one of: header, footer, card"
      };
    }
  });

  // Register a tool to optimize CSS
  pi.registerTool({
    name: "optimize_css",
    description: "Analyze and suggest optimizations for CSS files in the project",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Path to the CSS file to optimize"
        }
      },
      required: ["file_path"]
    },
    handler: async ({ file_path }) => {
      try {
        const content = await pi.tools.read({ path: file_path });
        
        // Simple CSS analysis
        let issues = [];
        let suggestions = [];
        
        if (!content.includes('font-family')) {
          suggestions.push("Add explicit font-family declarations for better consistency");
        }
        
        if (!content.includes('color')) {
          suggestions.push("Define consistent color scheme variables");
        }
        
        if (content.includes('!important')) {
          issues.push("Found !important usage - try to reduce dependencies on this");
        }
        
        // Check for common Tailwind classes in use
        const tailwindClasses = ['bg-', 'text-', 'p-', 'm-', 'w-', 'h-'];
        let usedTailwind = 0;
        tailwindClasses.forEach(cls => {
          if (content.includes(cls)) usedTailwind++;
        });
        
        if (usedTailwind > 0) {
          suggestions.push("Consider using full Tailwind classes in HTML instead of custom CSS where possible");
        }
        
        return {
          file: file_path,
          analysis: {
            issues,
            suggestions,
            total_lines: content.split('\n').length
          }
        };
      } catch (error) {
        return { error: `Failed to analyze CSS: ${error.message}` };
      }
    }
  });

  // Register a tool to suggest web development best practices
  pi.registerTool({
    name: "suggest_web_best_practices",
    description: "Suggest web development best practices for the current project",
    parameters: {
      type: "object",
      properties: {
        file_paths: {
          type: "array",
          items: { type: "string" },
          description: "List of files to analyze (optional)"
        }
      }
    },
    handler: async ({ file_paths }) => {
      const recommendations = [
        "Use semantic HTML elements for better accessibility",
        "Implement responsive design with mobile-first approach",
        "Ensure proper contrast ratios for text readability",
        "Add ARIA labels for interactive elements",
        "Optimize images for web use (consider WebP format)",
        "Implement lazy loading for better performance",
        "Use efficient CSS selectors and minimize repaints",
        "Add proper meta tags for SEO",
        "Include a favicon in the root directory",
        "Test page load speed with tools like Lighthouse"
      ];
      
      return {
        recommendations,
        context: file_paths ? `Analyzed files: ${file_paths.join(', ')}` : "Analyzed current project structure"
      };
    }
  });

  // Register command for web development help
  pi.registerCommand("web_dev_help", {
    description: "Provide help and guidance for web development tasks",
    handler: async () => {
      return {
        message: "Web Development Help Assistant",
        commands: [
          {
            name: "/web_dev_help",
            description: "Show this help message"
          },
          {
            name: "/analyze_html",
            description: "Analyze HTML structure and suggest improvements"
          },
          {
            name: "/generate_template",
            description: "Generate HTML templates for components"
          }
        ],
        tips: [
          "Use semantic HTML tags properly",
          "Follow mobile-first responsive design",
          "Keep CSS specificity low",
          "Optimize assets for performance",
          "Validate HTML and CSS using W3C validators"
        ]
      };
    }
  });
  
  // Register a command to analyze specific HTML files
  pi.registerCommand("analyze_html", {
    description: "Analyze an HTML file for structure and optimization",
    handler: async (args) => {
      const filePath = args.file || args._[0];
      if (!filePath) {
        return { error: "Please specify a file path to analyze" };
      }
      
      try {
        const result = await pi.tools.analyze_html_structure({ file_path: filePath });
        return {
          success: true,
          file: result.file,
          analysis: result.analysis
        };
      } catch (error) {
        return { error: `Failed to analyze HTML: ${error.message}` };
      }
    },
    arguments: [
      {
        name: "file",
        description: "Path to the HTML file to analyze"
      }
    ]
  });

  // Register a command to generate templates
  pi.registerCommand("generate_template", {
    description: "Generate HTML component templates",
    handler: async (args) => {
      const componentType = args.type || args._[0];
      if (!componentType) {
        return { error: "Please specify a component type (header, footer, card)" };
      }
      
      try {
        const result = await pi.tools.generate_html_template({ component_type: componentType });
        return {
          success: true,
          generated: result
        };
      } catch (error) {
        return { error: `Failed to generate template: ${error.message}` };
      }
    },
    arguments: [
      {
        name: "type",
        description: "Type of HTML template to generate"
      }
    ]
  });

  // Add a welcome message for the extension
  console.log("Web Development Helper extension loaded successfully!");
}