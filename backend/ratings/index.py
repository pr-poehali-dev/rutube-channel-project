'''
Business: API для сохранения и получения рейтингов статей
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с рейтингом или статусом операции
'''

import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            article_id = params.get('article_id')
            
            if not article_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'article_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "SELECT rating FROM article_ratings WHERE article_id = %s",
                (int(article_id),)
            )
            result = cursor.fetchone()
            
            rating = result[0] if result else 0
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'rating': rating}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            article_id = body_data.get('article_id')
            rating = body_data.get('rating')
            
            if not article_id or not rating:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'article_id and rating required'}),
                    'isBase64Encoded': False
                }
            
            if rating < 1 or rating > 5:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'rating must be between 1 and 5'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                """
                INSERT INTO article_ratings (article_id, rating) 
                VALUES (%s, %s)
                ON CONFLICT (article_id) 
                DO UPDATE SET rating = EXCLUDED.rating, created_at = CURRENT_TIMESTAMP
                RETURNING rating
                """,
                (int(article_id), int(rating))
            )
            
            conn.commit()
            result = cursor.fetchone()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'rating': result[0], 'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
