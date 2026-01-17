import json
import urllib.request
import urllib.parse

def handler(event: dict, context) -> dict:
    '''
    Получает данные из Google Таблицы и возвращает их в JSON формате.
    Поддерживает публичные таблицы без авторизации.
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    spreadsheet_id = '1U1jB1dBunDNXXtxpdAbbCsvo2EyWlMplXkobDNq2YJU'
    gid = '1713849799'
    
    csv_url = f'https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}'
    
    try:
        with urllib.request.urlopen(csv_url) as response:
            csv_data = response.read().decode('utf-8')
        
        lines = csv_data.strip().split('\n')
        
        if not lines:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'violators': [], 'violations': []}),
                'isBase64Encoded': False
            }
        
        headers = [h.strip() for h in lines[0].split(',')]
        
        violators = []
        violations = []
        
        for line in lines[1:]:
            if not line.strip():
                continue
            
            values = []
            current_value = ''
            in_quotes = False
            
            for char in line:
                if char == '"':
                    in_quotes = not in_quotes
                elif char == ',' and not in_quotes:
                    values.append(current_value.strip())
                    current_value = ''
                else:
                    current_value += char
            values.append(current_value.strip())
            
            if len(values) >= 4:
                row_data = {headers[i]: values[i] if i < len(values) else '' for i in range(len(headers))}
                
                if row_data.get(headers[0]):
                    violator = {
                        'id': row_data.get(headers[0], ''),
                        'fullName': row_data.get(headers[1], ''),
                        'position': row_data.get(headers[2], ''),
                        'department': row_data.get(headers[3], ''),
                        'employeeId': row_data.get(headers[0], '')
                    }
                    violators.append(violator)
                    
                    if len(values) > 4 and row_data.get(headers[4]):
                        violation = {
                            'id': f"{row_data.get(headers[0], '')}_{len(violations)}",
                            'violatorId': row_data.get(headers[0], ''),
                            'violatorName': row_data.get(headers[1], ''),
                            'violationType': row_data.get(headers[4], ''),
                            'date': row_data.get(headers[5], '') if len(headers) > 5 else '',
                            'description': row_data.get(headers[6], '') if len(headers) > 6 else '',
                            'penalty': row_data.get(headers[7], '') if len(headers) > 7 else '',
                            'status': 'active'
                        }
                        violations.append(violation)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'violators': violators,
                'violations': violations,
                'total': len(violators)
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to fetch data',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }
