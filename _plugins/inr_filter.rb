module Jekyll
  module InrFilter
    # Formats a number with Indian digit grouping: last 3 digits, then groups of 2.
    # e.g. 14900 -> "14,900", 1234567 -> "12,34,567"
    def inr(number)
      return number if number.nil?

      whole = number.to_i.to_s
      negative = whole.start_with?('-')
      whole = whole.delete_prefix('-')

      last_three = whole[-3..-1] || whole
      remainder = whole[0..-4] || ''

      formatted = if remainder.empty?
                    last_three
                  else
                    grouped = remainder.reverse.scan(/\d{1,2}/).join(',').reverse
                    "#{grouped},#{last_three}"
                  end

      negative ? "-#{formatted}" : formatted
    end
  end
end

Liquid::Template.register_filter(Jekyll::InrFilter)
