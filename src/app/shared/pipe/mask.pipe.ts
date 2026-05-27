import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "mask",
})
export class NumberMaskPipe implements PipeTransform {
  transform(input: string): string {
    const visibleStart = 3; // Number of visible characters at the start
    const visibleEnd = 3; // Number of visible characters at the end

    if (input.length <= visibleStart + visibleEnd) {
      return input; // If the string is shorter than or equal to the sum of visible parts, return as is.
    }

    const start = input.slice(0, visibleStart);
    const end = input.slice(-visibleEnd);
    const maskedSection = input
      .slice(visibleStart, -visibleEnd)
      .replace(/./g, "*"); // Masking middle part

    return start + maskedSection + end; // Concatenate the parts
  }
}
