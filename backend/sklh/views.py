from django.http import JsonResponse

def index(request):
    return JsonResponse({
        'message': "It works!"
    })

def healthz(request):
    return JsonResponse({
        'status': "ok"
    })

def is_alive(request):
    return JsonResponse({
        'okay': True,
        'message': "Backend is alive"
    })

def wake_up(request):
    return JsonResponse({
        'job': "Done!"
    })