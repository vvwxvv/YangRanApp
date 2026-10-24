export const preprocessMarkdownText = (text: string): string => {
    let processedText = String(text); // Ensure text is a string
    processedText = processedText.replace(/\\n/g, "\n");
  
    return processedText;
  };