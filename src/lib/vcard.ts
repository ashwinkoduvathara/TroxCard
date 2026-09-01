export function generateAndDownloadVCard(data: any) {
  if (!data) return
  const vcardContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.fullName || data.name || ''}`,
    `TITLE:${data.jobTitle || ''}`,
    `ORG:${data.company || ''}`,
    `TEL;TYPE=CELL:${data.phone || ''}`,
    `EMAIL:${data.email || ''}`,
    `URL:${data.website || ''}`,
    `NOTE:${data.bio || ''}`,
    'END:VCARD'
  ].join('\n')

  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${(data.fullName || 'contact').replace(/\s+/g, '_')}.vcf`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
