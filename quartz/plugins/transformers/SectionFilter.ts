// plugins/transformers/SectionFilter.ts
import { QuartzTransformerPlugin } from "../types"

interface Options {
  // Default behavior for sections with no markers
  includeByDefault?: boolean
  // Customize the markers used for inclusion/exclusion
  includeMarker?: string
  excludeMarker?: string
  // Whether to remove the markers from the output
  removeMarkers?: boolean
}

export const SectionFilter: QuartzTransformerPlugin<Options> = (opts?) => {
  const options = {
    includeByDefault: true,
    includeMarker: "<!-- publish: include -->",
    excludeMarker: "<!-- publish: exclude -->",
    removeMarkers: true,
    ...opts
  }

  return {
    name: "SectionFilter",
    textTransform(_ctx, content) {
      // This is where we'll process the content to filter sections

      // If no markers are found, just return the content as is based on the default setting
      if (!content.includes(options.includeMarker) && !content.includes(options.excludeMarker)) {
        return content
      }

      // Define regex patterns for our markers
      const includeStartPattern = new RegExp(options.includeMarker, 'g')
      const excludeStartPattern = new RegExp(options.excludeMarker, 'g')
      const endMarker = "<!-- publish: end -->"
      const endPattern = new RegExp(endMarker, 'g')

      // Process the content
      let result = content
      let currentPos = 0
      let inExcludedSection = false
      let sectionsToRemove = []
      
      // Find all markers and track sections to remove
      while (currentPos < content.length) {
        const includePos = content.indexOf(options.includeMarker, currentPos)
        const excludePos = content.indexOf(options.excludeMarker, currentPos)
        const endPos = content.indexOf(endMarker, currentPos)
        
        // If we're not in an excluded section and we found an exclude marker before any other marker
        if (!inExcludedSection && excludePos !== -1 && (includePos === -1 || excludePos < includePos) && (endPos === -1 || excludePos < endPos)) {
          inExcludedSection = true
          const sectionStart = excludePos
          currentPos = excludePos + options.excludeMarker.length
          
          // Find the end of this section
          const sectionEndPos = content.indexOf(endMarker, currentPos)
          if (sectionEndPos !== -1) {
            // Mark this section for removal
            sectionsToRemove.push({
              start: sectionStart,
              end: sectionEndPos + endMarker.length
            })
            inExcludedSection = false
            currentPos = sectionEndPos + endMarker.length
          } else {
            // If no end marker, exclude to the end of the document
            sectionsToRemove.push({
              start: sectionStart,
              end: content.length
            })
            currentPos = content.length
          }
        } 
        // If we found an include marker
        else if (includePos !== -1 && (excludePos === -1 || includePos < excludePos) && (endPos === -1 || includePos < endPos)) {
          currentPos = includePos + options.includeMarker.length
        }
        // If we found an end marker
        else if (endPos !== -1 && (includePos === -1 || endPos < includePos) && (excludePos === -1 || endPos < excludePos)) {
          currentPos = endPos + endMarker.length
        }
        // If we didn't find any more markers
        else {
          break
        }
      }
      
      // Remove the excluded sections, starting from the end to maintain correct indices
      for (let i = sectionsToRemove.length - 1; i >= 0; i--) {
        const { start, end } = sectionsToRemove[i]
        result = result.substring(0, start) + result.substring(end)
      }
      
      // Optionally remove the markers from the final output
      if (options.removeMarkers) {
        result = result.replace(includeStartPattern, '')
        result = result.replace(excludeStartPattern, '')
        result = result.replace(endPattern, '')
      }
      
      return result
    }
  }
}