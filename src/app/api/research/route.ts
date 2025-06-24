import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100) // microCMSの制限に合わせて100件まで
    const offset = parseInt(searchParams.get('offset') || '0')

    // 環境変数チェック
    const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
    const apiKey = process.env.MICROCMS_API_KEY

    if (!serviceDomain || !apiKey) {
      console.error('microCMS環境変数が設定されていません')
      return NextResponse.json(
        { error: 'microCMS configuration is missing' },
        { status: 500 }
      )
    }

    console.log('🔍 microCMSからデータを取得中...', {
      serviceDomain: serviceDomain.substring(0, 5) + '***',
      apiKey: apiKey.substring(0, 5) + '***',
      limit,
      offset
    })

    // microCMSへの直接API呼び出し
    const microCMSUrl = `https://${serviceDomain}.microcms.io/api/v1/articles?limit=${limit}&offset=${offset}&orders=-createdAt&filters=ai_generated[equals]true`
    
    const response = await fetch(microCMSUrl, {
      headers: {
        'X-MICROCMS-API-KEY': apiKey,
      },
    })

    if (!response.ok) {
      console.error('microCMS API エラー:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('エラー詳細:', errorText)
      throw new Error(`microCMS API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log(`✅ ${data.contents?.length || 0}件の記事を取得`)

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ API Route エラー:', error)
    return NextResponse.json(
      { error: 'Failed to fetch research articles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 