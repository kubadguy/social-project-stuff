from django.http import JsonResponse

def index(request):
    return JsonResponse({
        'message': 'It works!'
    })

def healthz(request):
    return JsonResponse({
        'status': 'ok'
    })